import React from 'react';
import { isAudioSupported } from './utils/audioRecording';

// https://stackoverflow.com/a/32348687/2640153
function isFacebookApp(): boolean {
    var ua: string = navigator.userAgent || navigator.vendor || (window as any).opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

export type Props = { children: any };
const EnforceAudioSupport = (p: Props) => {
    let error = null;

    const isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    const isAndroid = /(android)/i.test(navigator.userAgent);
        
    if (isFacebookApp()) {
        const isFacebookLite = isAndroid && /FBLC/i.test(navigator.userAgent);

        error = (
            <div>Facebook's browser is not supported.</div>
        );
    } else if (!isAudioSupported()) {
        error = (
            isIOS ?
            <>
                Audio recording in iOS is supported only via Safari browser. <br /><br />
                Please click below to copy the URL. After you do, please open it using Safari.
            </> :
            <>
                Audio recording not supported!
            </>
        );
    }

    if (error) {
        return (
            <div>
                {error} 
            </div>
        );
    }
        
    return p.children;
}
export default EnforceAudioSupport;
        