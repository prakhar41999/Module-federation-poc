import { storageKey } from "@/constants/common.const";
import { utilLabels } from "@/constants/label.const";
import { signOut } from 'next-auth/react';


export const getTenantId = (): string => {
    if (typeof globalThis.window !== 'undefined') {
        const encodedBaseUrl = localStorage.getItem(storageKey.CONFIG_TENANT_ID);
        if (encodedBaseUrl) {
            return globalThis.window.atob(encodedBaseUrl);
        }
    }
    return '';
};


export const getBaseUrl = () => {
    if (typeof globalThis.window !== 'undefined') {
        const encodedBaseUrl = localStorage.getItem(storageKey.CONFIG_BASE_PATH);
        if (encodedBaseUrl) {
            return globalThis.window.atob(encodedBaseUrl);
        }
    }
    return '';
};

export const handleUserLogout = () => {
    if (typeof globalThis.window !== 'undefined') {
        const tenantId = getTenantId();
        localStorage.setItem(storageKey.CONFIG_LOGOUT, new Date().toISOString());
        const postLogoutRedirectUri = `${globalThis.window.location.origin}` + (getBaseUrl() ?? '');
        const logoutUrl = `${utilLabels.LOGOUT_URL[0]}${tenantId}${utilLabels.LOGOUT_URL[1]}${postLogoutRedirectUri}`;
        sessionStorage.clear();
        //deleting the filter options from local storage
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(storageKey.FILTER_OPTION_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(storageKey.FILTER_APPLIED_ON_PREFIX)) {
                localStorage.removeItem(key);
            }
        }
        localStorage.removeItem(storageKey.VISIBLE_COLUMNS);
        localStorage.removeItem(storageKey.SELECTED_DOC_TYPE);
        signOut({ redirect: false }).then(() => {
            globalThis.window.location.href = logoutUrl;
        });
    }
};