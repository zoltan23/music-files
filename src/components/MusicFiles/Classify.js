import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGuitar, faTrumpet } from '@fortawesome/free-solid-svg-icons'
import '../../../src/icons/my-icons-collection/font/flaticon.css'
import { ReactComponent as Trumpet } from '../../../src/icons/my-icons-collection/svg/trumpet.svg'
import { ReactComponent as Flute } from '../../../src/icons/my-icons-collection/svg/flute.svg'
import { ReactComponent as Cello } from '../../../src/icons/my-icons-collection/svg/cello.svg'
import { ReactComponent as Clarinet } from '../../../src/icons/my-icons-collection/svg/clarinet.svg'
import { ReactComponent as AcousticGuitar } from '../../../src/icons/my-icons-collection/svg/guitar.svg'
import { ReactComponent as DoubleBass } from '../../../src/icons/my-icons-collection/svg/flute.svg'
import { ReactComponent as HiHat } from '../../../src/icons/my-icons-collection/svg/hihat.svg'
import { ReactComponent as Saxophone } from '../../../src/icons/my-icons-collection/svg/saxophone.svg'
import { ReactComponent as SnareDrum } from '../../../src/icons/my-icons-collection/svg/snare.svg'
import { ReactComponent as Violin } from '../../../src/icons/my-icons-collection/svg/violin.svg'
import { ReactComponent as BassDrum } from '../../../src/icons/my-icons-collection/svg/bassdrum.svg'
import { ReactComponent as Warning } from '../../../src/icons/my-icons-collection/svg/warning.svg'
//import './MusicFileList.css'

function Classify() {

    //After you get the value from the ML program, display the instrument
    let instrument = 'Bass_drum'
    let icon;
    switch (instrument) {
        case 'Trumpet':
            icon = <Trumpet />
            break
        case 'Saxophone':
            icon = <Saxophone />
            break
        case 'Violin_or_fiddle':
            icon = <Violin />
            break
        case 'Hi-hat':
            icon = <HiHat />
            break
        case 'Snare_drum':
            icon = <SnareDrum />
            break
        case 'Acoustic_guitar':
            icon = <AcousticGuitar />
            break
        case 'Double_bass':
            icon = <DoubleBass />
            break
        case 'Cello':
            icon = <Cello />
            break
        case 'Bass_drum':
            icon = <BassDrum />
            break
        case 'Flute':
            icon = <Flute />
            break
        case 'Clarinet':
            icon = <Clarinet />
            break
        default:
            icon = <Warning />   
    }

    return (
        <div>
            {icon}
            {/* <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> */}
        </div>
    )
}

export default Classify

