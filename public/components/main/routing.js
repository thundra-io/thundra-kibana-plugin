import { createLocation } from 'history';

const isModifiedEvent = event => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const isLeftClickEvent = event => event.button === 0;

let router;
export const registerRouter = reactRouter => {
    router = reactRouter;
};

/**
 * The logic for generating hrefs and onClick handlers from the `to` prop is largely borrowed from
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/Link.js.
 */
export const getRouterLinkProps = to => {
    const location = typeof to === "string"
        ? createLocation(to, null, null, router.history.location)
        : to;

    const href = router.history.createHref(location);

    const onClick = event => {
        if (event.defaultPrevented) {
            return;
        }

        // If target prop is set (e.g. to "_blank"), let browser handle link.
        if (event.target.getAttribute('target')) {
            return;
        }

        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
            return;
        }

        // Prevent regular link behavior, which causes a browser refresh.
        event.preventDefault();
        router.history.push(location);
    };

    return {href, onClick}
};