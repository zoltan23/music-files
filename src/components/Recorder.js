import React, { Component } from 'react';
import './Recorder.css'

class Recorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            note: "G",
            pitch: ""
        }
        this.createVisualization = this.createVisualization.bind(this)
    }

    componentDidMount() {
        this.createVisualization()
    }

    createVisualization() {
        let audioContext = new AudioContext();
        let analyser = audioContext.createAnalyser();
        let canvas = this.refs.analyzerCanvas;
        let ctx = canvas.getContext('2d');
        let audio = this.refs.audio;
        audio.crossOrigin = "anonymous";
        let audioSrc = audioContext.createMediaElementSource(audio);
        audioSrc.connect(analyser);
        audioSrc.connect(audioContext.destination);
        analyser.connect(audioContext.destination);

        var rafID = null;
        var tracks = null;
        var buflen = 1024;
        var buf = new Float32Array(buflen);
        var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
        var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

        var detectorElem = this.refs.detector
        var canvasElem = this.refs.output
        // var pitchElem = this.refs.pitch
        // var noteElem = this.refs.note
        var detuneElem = this.refs.detune
        var detuneAmount = this.refs.detune_amt
        var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

        var _this = this

        function noteFromPitch(frequency) {
            var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
            return Math.round(noteNum) + 69;
        }

        function frequencyFromNoteNumber(note) {
            return 440 * Math.pow(2, (note - 69) / 12);
        }

        function centsOffFromPitch(frequency, note) {
            return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
        }

        function renderFrame() {
            let freqData = new Uint8Array(analyser.frequencyBinCount)
            requestAnimationFrame(renderFrame)
            analyser.getByteFrequencyData(freqData)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // console.log(freqData)
            ctx.fillStyle = '#9933ff';
            let bars = 100;
            for (var i = 0; i < bars; i++) {
                let bar_x = i * 3;
                let bar_width = 2;
                let bar_height = -(freqData[i] / 2);
                ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
            }
        }

        function autoCorrelate(buf, sampleRate) {
            var SIZE = buf.length;
            var MAX_SAMPLES = Math.floor(SIZE / 2);
            var best_offset = -1;
            var best_correlation = 0;
            var rms = 0;
            var foundGoodCorrelation = false;
            var correlations = new Array(MAX_SAMPLES);

            for (var i = 0; i < SIZE; i++) {
                var val = buf[i];
                rms += val * val;
            }
            rms = Math.sqrt(rms / SIZE);
            if (rms < 0.01) // not enough signal
                return -1;

            var lastCorrelation = 1;
            for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
                var correlation = 0;

                for (var i = 0; i < MAX_SAMPLES; i++) {
                    correlation += Math.abs((buf[i]) - (buf[i + offset]));
                }
                correlation = 1 - (correlation / MAX_SAMPLES);
                correlations[offset] = correlation; // store it, for the tweaking we need to do below.
                if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                    foundGoodCorrelation = true;
                    if (correlation > best_correlation) {
                        best_correlation = correlation;
                        best_offset = offset;
                    }
                } else if (foundGoodCorrelation) {
                    // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                    // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                    // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                    // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                    // (anti-aliased) offset.

                    // we know best_offset >=1, 
                    // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
                    // we can't drop into this clause until the following pass (else if).
                    var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
                    return sampleRate / (best_offset + (8 * shift));
                }
                lastCorrelation = correlation;
            }
            if (best_correlation > 0.01) {
                // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
                return sampleRate / best_offset;
            }
            return -1;
            //	var best_frequency = sampleRate/best_offset;
        }

        function updatePitch(time) {
            // var cycles = new Array();
            analyser.getFloatTimeDomainData(buf);
            var ac = autoCorrelate(buf, audioContext.sampleRate);

            if (ac == -1) {
                detectorElem.className = "vague";
                // pitchElem.innerText = "--";
                _this.setState({ pitch: "-" })
                _this.setState({ note: "-" })
                detuneElem.className = "";
                detuneAmount.innerText = "--";
            } else {
                detectorElem.className = "confident";
                const pitch = ac;
                // pitchElem.innerText = Math.round(pitch);
                _this.setState({ pitch: Math.round(pitch) })
                var note = noteFromPitch(pitch);
                console.log('note', note)
                // noteElem.innerHTML = noteStrings[note % 12];
                _this.setState({ note: noteStrings[note % 12] })
                var detune = centsOffFromPitch(pitch, note);
                if (detune == 0) {
                    detuneElem.className = "";
                    detuneAmount.innerHTML = "--";
                } else {
                    if (detune < 0)
                        detuneElem.className = "flat";
                    else
                        detuneElem.className = "sharp";
                    detuneAmount.innerHTML = Math.abs(detune);
                }
            }

            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = window.webkitRequestAnimationFrame;
            rafID = window.requestAnimationFrame(updatePitch);
        }

        renderFrame()
        updatePitch()
    }



    render() {
        return (
            <div>
                <h2>Recorder</h2>

                <div className="flex-container">
                    <div>
                       
                        <div id="mp3_player">
                            <div id="audio_box">
                                <audio
                                    ref="audio"
                                    autoPlay={true}
                                    controls={true}
                                    //this is the link to my song url feel free to use it or replace it with your own
                                    // src={"https://p.scdn.co/mp3-preview/e4a8f30ca62b4d2a129cc4df76de66f43e12fa3f?cid=null"}
                                    src={"/audio/BabyElephantWalk60.wav"}
                                >
                                </audio>
                            </div>
                            <canvas
                                ref="analyzerCanvas"
                                id="analyzer"
                            >
                            </canvas>
                        </div>

                        <div ref="detector" id="detector" class="vague">
                            <div id="pitch">{this.state.pitch} Hz</div>
                            <div id="note">{this.state.note}</div>
                            <canvas ref="output" id="output" width="300" height="42"></canvas>
                            <div ref="detune" id="detune"><span ref="detune_amt" id="detune_amt">--</span><span id="flat">cents &#9837;</span><span id="sharp">cents &#9839;</span></div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Recorder;