"use client"
export async function fetchClient(url, options = {}) {
    const defaultOptions = {
        headers: {
            'accept':'application/json;charset=UTF-8',
            'Content-Type':'application/json',
            ...options.headers
        }
    };
    return await fetch(url, { cache:'no-cache', ...defaultOptions, ...options }).then(v=>v.json());
}