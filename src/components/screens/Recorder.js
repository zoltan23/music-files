import React, { Component } from 'react';
import './Recorder.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import "./Callout.css"
import RecordRTC, { invokeSaveAsDialog, StereoAudioRecorder } from "recordrtc"
import { storage, db } from "../../services/firebase"
import { v4 } from 'uuid';

class Recorder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            note: "G",
            pitch: "",
            audioSrc: "",
            micInput: '',
            showDetector: true,
            //Timer
            time: 0,
            isOn: false,
            start: 0,
            toggleRecord: false,
            countDown: 0,
            timer: {},
            time: 0,
            timerStarted: false,
            showThirtySecondCountDown: false
        }
        this.createVisualization = this.createVisualization.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentWillUnmount = this.componentWillUnmount.bind(this)
        this.closeAudioStream = this.closeAudioStream.bind(this)
        this.clickRecord = this.clickRecord.bind(this)

        this.countDownTimer = this.countDownTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.clickStop = this.clickStop.bind(this)
        this.recordAudio = this.recordAudio.bind(this)
        this.uploadRecordAudio = this.uploadRecordAudio.bind(this)
        this.getAudioStream = this.getAudioStream.bind(this)

    }

    componentDidMount() {
        this.getAudioStream()
            .then(audio => {
                console.log('track mounted :', audio.getTracks()[0].label)
                this.setState({ micLabel: audio.getTracks()[0].label })
                this.createVisualization()
            })
            // Todo: add error
            .catch(e => console.log('error getting media', e))
    }

    componentWillUnmount() {
        this.closeAudioStream()
    }

    // async useAudioSource() {
    //     let audioContext = this.audioContext
    //     if (audioContext) await audioContext.close()
    //     audioContext = new AudioContext();
    //     let audio = this.refs.audio;
    //     audio.crossOrigin = "anonymous";

    //     let audioSrc = audioContext.createMediaElementSource(audio);
    //     this.audioContext = audioContext
    //     this.createVisualization(audioSrc, audioContext)
    // }

    closeAudioStream() {
        if (this.audio) {
            this.audio.getTracks().forEach(track => { console.log('track', track); track.stop() });
        }
    }

    async getAudioStream() {
        console.log('getAudioStream()')
        if (!this.audio) {
            this.audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

            this.recorder = new RecordRTC(this.audio, {
                type: 'audio',                
                mimeType: 'audio/wav',
                recorderType: StereoAudioRecorder
                //sampleRate: 96000,
                //numberOfAudioChannels: 2,
            });
        }
        return this.audio
    }

    async createVisualization() {
        try {
            console.log('createVisualization()')

            const audioContext = new AudioContext();

            let audioSrc = audioContext.createMediaStreamSource(await this.getAudioStream());
            let analyser = audioContext.createAnalyser();

            let canvas = this.refs.analyzerCanvas;
            let ctx = canvas.getContext('2d');

             analyser.smoothingTimeConstant = .01

            audioSrc.connect(analyser);
            // audioSrc.connect(audioContext.destination);
            // analyser.connect(audioContext.destination);

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
                if (rms < 0.1) // not enough signal
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
                    // console.log('note', note)
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
        } catch (e) {
            console.log('error createVisualization()', e)
            this.closeAudioStream()
        }

    }

    async clickRecord(e) {
        e.preventDefault()
        console.log('Record Pressed')
        let _this = this
        _this.setState({ showDetector: true, toggleRecord: true, showUpload: false, showThirtySecondCountDown: false })

        console.log('starting counter')
        this.setState({ showDetector: false })
        await this.countDownTimer(5) // Wait 5 seconds
        console.log('done with 5 second counter')
        this.setState({ showThirtySecondCountDown: true, showDetector: true })
        this.recordAudio()
        await this.countDownTimer(5) // Wait 5 seconds
        this.stopRecordAudio()
        console.log('done with 30 second counter')
        this.setState({ showDetector: true, toggleRecord: false, showUpload: true, showThirtySecondCountDown: false })
    }

    async stopTimer() {
        return new Promise((resolve, reject) => {
            this.setState({ showDetector: true, timerStarted: false, toggleRecord: false, showThirtySecondCountDown: false }, () => {
                clearInterval(this.timer)
                console.log('stop timer done')
                resolve()
            })
        })
    }

    async recordAudio() {
        this.recorder.startRecording();
    }

    async stopRecordAudio() {
        let _this = this
        return new Promise((resolve, reject) => {
            _this.recorder.stopRecording(function () {
                // let blob = _this.recorder.getBlob();
                // invokeSaveAsDialog(blob);
                resolve()
            });
        })
    }

    async uploadRecordAudio(e) {
        e.preventDefault()
        console.log('save record Audio')
        var storageRef = storage.ref();
        var fileName = `recorded-${v4()}.wav`
        var userId = this.props.uid
        var storagePath = `music_files/${userId}/${fileName}`
        console.log('storagePath', storagePath)
        var ref = storageRef.child(storagePath);
        let snapshot = await ref.put(this.recorder.getBlob());
        console.log('Uploaded a blob or file!');
        console.log(snapshot)
        await db.collection("music").doc(userId).collection('musicId').doc().set({
            //db.collection(userId).doc().set({
            filePath: storagePath,
            filename: fileName,
            note: 'G'
        })
    }

    clickStop(e) {
        this.setState({ showUpload: false })
        e.preventDefault()
        this.stopTimer()
    }


    countDownTimer(seconds) {
        const _this = this
        _this.setState({ countDown: seconds, start: Date.now(), time: seconds, timerStarted: true, toggleRecord: true })
        return new Promise((resolve, reject) => {
            _this.timer = setInterval(async () => {

                let milliseconds = Date.now() - this.state.start

                const t = this.state.countDown - Math.round((milliseconds / 1000))

                if (t <= 0 || !_this.state.timerStarted) {
                    resolve()
                } else {
                    _this.setState({
                        time: t
                    })
                }
            }, 1000);
        })
    }

    render() {

        return (
            <div>
                <div className="container-fluid">
                    <div class="row">
                        <div id="col-12 accordion">
                            <div class="card">
                                <div class="card-header" id="headingOne">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Instructions
                                        </button>
                                    </h5>
                                </div>

                                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                                    <div class="card-body">
                                        <div class="bd-callout bd-callout-primary">
                                            We do not stream live audio to our servers.
                                    </div>
                                        <p>
                                            Record your instrument for at least 30 seconds.  When, pressing
                                record, a count down timer will appear allowing you to setup your
                                before playing.  After 30 seconds, a dialog box will appear for you
                                to accept a recording.  Only audio information from the recording
                                is ever sent back to our servers.  The live audio you see, is a
                                visual representation of what your audio looks like.  To stop the mic, simply
                                click off the tab.
                                </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row no-gutters">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle btn-block " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.micLabel}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#!">{this.state.micLabel}</a>
                            </div>
                        </div>
                    </div>

                    <div class="row d-flex justify-content-center">
                        <div>
                            <div class="card-body">
                                <div class="card-title">Notes</div>
                                <div class="card-text">
                                    <canvas
                                        ref="analyzerCanvas"
                                        id="analyzer"
                                    >
                                    </canvas>
                                </div>
                                <div class="card-body">
                                    <span className={this.state.showThirtySecondCountDown ? "" : "hidden"}>Play a long tone for {this.state.time}</span>
                                    <div className={this.state.showDetector ? "" : "hidden"}>
                                        <div ref="detector" id="detector" class="vague">
                                            <div id="pitch">{this.state.pitch} Hz</div>
                                            <div id="note">{this.state.note}</div>
                                            <canvas ref="output" id="output" width="300" height="42"></canvas>
                                            <div ref="detune" id="detune"><span ref="detune_amt" id="detune_amt">--</span><span id="flat">cents &#9837;</span><span id="sharp">cents &#9839;</span></div>
                                        </div>
                                    </div>
                                    <div className={this.state.showDetector ? "hidden" : "count-down"} >
                                        <div class="count-down-number">{this.state.time}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-6">
                        <a onClick={e => this.clickRecord(e)} href="#!" class={this.state.toggleRecord ? 'hidden' : 'btn btn-danger btn-block'}><FontAwesomeIcon icon={faCircle} />&nbsp;Record</a>
                        <a onClick={e => this.clickStop(e)} href="#!" class={this.state.toggleRecord ? 'btn btn-danger btn-block' : 'hidden'}><FontAwesomeIcon icon={faCircle} />&nbsp;Stop</a>
                    </div>
                    <div class="col-6">
                        <a onClick={e => this.uploadRecordAudio(e)} href="#!" class={this.state.showUpload ? 'btn btn-success btn-block' : 'hidden'} ><FontAwesomeIcon icon={faCloudUploadAlt} />&nbsp;Upload </a>
                    </div>
                </div>

                <div class="bottom-padding" />
            </div>

        );
    }
}

export default Recorder;