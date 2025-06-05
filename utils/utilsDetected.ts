export const detectMob = (userAgent) => {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  const isMobile = toMatch.some((toMatchItem) => {
    return userAgent.match(toMatchItem);
  });

  if (isMobile) {
    return "mobile";
  }
  return "desktop";
};

export const BrowserDetected = (userAgent) => {
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    return "firefox";
  } else if (userAgent.match(/safari/i)) {
    return "safari";
  } else if (userAgent.match(/opr\//i)) {
    return "opera";
  } else if (userAgent.match(/edg/i)) {
    return "edge";
  } else {
    return "No browser detection";
  }
};

export const oSDetected = (userAgent) => {
  const macosPlatforms = ["Mac"];
  const windowsPlatforms = ["Win"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os = null;
  if (userAgent.match(macosPlatforms)) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(userAgent) !== -1) {
    os = "iOS";
  } else if (userAgent.match(windowsPlatforms)) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (/Linux/.test(userAgent)) {
    os = "Linux";
  }

  return os;
};
