export const toHms = (t) => {
    let hms = "";
    const h = t / 3600 | 0;
    const m = t % 3600 / 60 | 0;
    const s = t % 60;

    if (h != 0) {
        hms = h + "時間" + padZero(m) + "分" + padZero(s) + "秒";
    } else if (m != 0) {
        hms = m + "分" + padZero(s) + "秒";
    } else {
        hms = s + "秒";
    }

    return hms;

    function padZero(v) {
        if (v < 10) {
            return "0" + v;
        } else {
            return v;
        }
    }
}