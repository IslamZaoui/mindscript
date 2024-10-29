export const load = (async (event) => {
    return {
        user: event.locals.auth.user
    };
});