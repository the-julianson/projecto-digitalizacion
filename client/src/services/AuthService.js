// client/src/services/AuthService.js

export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('docu.auth'));
    if (auth) {
      return auth.access;
    }
    return undefined;
  };

export const getUser = () => {

    const access_token = getAccessToken();
    if (access_token) {
        const [, payload, ] = access_token.split(".");
        const decoded = window.atob(payload);
        return JSON.parse(decoded);
    }
    return undefined
};



// export const isOperator = () => {
//     const user = getUser();
//     return user && user.group === "operator";
// };
//
// export const isManager = () => {
//     const user = getUser();
//     return user && user.group === "manager";
// };

export const isRider = () => {
    const user = getUser();
    return user && user.group.includes("operator");
};

export const isDriver = () => {
    const user = getUser();
    return user && user.group.includes("driver");
};

