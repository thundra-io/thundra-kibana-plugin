
export const KIBANA_THUNDRA_PATH = "/nwz/app/thundra#/";

export function getRealPath(){
    const url = window.location.href;
    const startChar = url.indexOf('/', 8);
    const path = url.substr(startChar, url.length);
    return path.substr(0, path.lastIndexOf('/'));
}