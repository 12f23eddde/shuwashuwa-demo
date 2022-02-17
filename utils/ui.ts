// Credit: @vant/weapp/toast/toast.js
export const getCurrentPage = () => {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}