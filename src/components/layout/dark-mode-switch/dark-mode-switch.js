import React, { useEffect, useState } from "react"
import _ from "lodash"

import darkModeSwitchStyles from "./dark-mode-switch.module.scss"

const CURRENT_THEME = "currentTheme"
const USER_THEME = "userTheme"
const OS_THEME = "osTheme"
const ATTR = "data-theme"

/**
 * Shows a switch that toggles whether the site is in dark mode. Will also
 * listen for changes from the operating system (like enabling system-wide
 * dark mode) or other instances of this plugin.
 *
 * Uses local storage to help sync state between multiple instances. This
 * technique is used because this component must be usable in Markdown files
 * where it can't be supplied props from a raised state. Local storage is used
 * as follows:
 * - currentTheme
 *      ["light", "dark", null]
 * - userTheme
 *      ["light", "dark", null]
 * - osTheme
 *      ["light", "dark", null]
 *
 * Uses an attribute on the root document element to influence CSS on the site:
 * - data-theme
 *      ["light", "dark", unset -> "light"]
 *
 * This component is assumed to load late. Code is inserted into the head tag
 * during server-side rendering that will set the attribute as quickly as
 * possible to provide a seamless experience. That code is located in
 * `gatsby-ssr.js`.
 *
 * @constructor
 */
export default function DarkModeSwitch() {
    const [switchShowsDark, setSwitchShowsDark] = useState(false)
    const [id] = useState(_.uniqueId("dms"))

    // Initial state and local storage configuration
    // Runs once with no teardown
    useEffect(() => {
        if (document.documentElement.getAttribute(ATTR) != null)
            setSwitchShowsDark(
                document.documentElement.getAttribute(ATTR) === "dark"
            )
        else if (localStorage.getItem(CURRENT_THEME) != null)
            setSwitchShowsDark(localStorage.getItem(CURRENT_THEME) === "dark")
        else setSwitchShowsDark(false)
    }, [])

    // Set up media queries and listeners to detect OS theme changes
    // Runs once with teardown of removing the listeners
    useEffect(() => {
        const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const lightMediaQuery = window.matchMedia(
            "(prefers-color-scheme: light)"
        )

        if (darkMediaQuery.matches && localStorage.getItem(OS_THEME) !== "dark")
            localStorage.setItem(OS_THEME, "dark")
        else if (
            lightMediaQuery.matches &&
            localStorage.getItem(OS_THEME) !== "light"
        )
            localStorage.setItem(OS_THEME, "light")

        // From Mozilla's docs on how to safely detect when passive can be used
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        let passiveSupported = false
        try {
            const options = {
                get passive() {
                    // This function will be called when the browser
                    // attempts to access the passive property.
                    passiveSupported = true
                    return false
                },
            }

            window.addEventListener("test", null, options)
            // noinspection JSCheckFunctionSignatures
            window.removeEventListener("test", null, options)
        } catch (err) {
            passiveSupported = false
        }

        const darkMediaListener = event => {
            if (event.matches) {
                if (localStorage.getItem(OS_THEME) !== "dark")
                    localStorage.setItem(OS_THEME, "dark")
                if (localStorage.getItem(USER_THEME) == null) {
                    setSwitchShowsDark(true)
                    if (localStorage.getItem(CURRENT_THEME) !== "dark")
                        localStorage.setItem(CURRENT_THEME, "dark")
                    if (document.documentElement.getAttribute(ATTR) !== "dark")
                        document.documentElement.setAttribute(ATTR, "dark")
                }
            }
        }
        const lightMediaListener = event => {
            if (event.matches) {
                if (localStorage.getItem(OS_THEME) !== "light")
                    localStorage.setItem(OS_THEME, "light")
                if (localStorage.getItem(USER_THEME) == null) {
                    setSwitchShowsDark(false)
                    if (localStorage.getItem(CURRENT_THEME) !== "light")
                        localStorage.setItem(CURRENT_THEME, "light")
                    if (document.documentElement.getAttribute(ATTR) !== "light")
                        document.documentElement.setAttribute(ATTR, "light")
                }
            }
        }

        if (typeof darkMediaQuery.addEventListener === typeof Function) {
            darkMediaQuery.addEventListener(
                "change",
                darkMediaListener,
                passiveSupported ? { passive: true } : false
            )
            lightMediaQuery.addEventListener(
                "change",
                lightMediaListener,
                passiveSupported ? { passive: true } : false
            )

            return () => {
                darkMediaQuery.removeEventListener(
                    "change",
                    darkMediaListener,
                    passiveSupported ? { passive: true } : false
                )
                lightMediaQuery.removeEventListener(
                    "change",
                    lightMediaListener,
                    passiveSupported ? { passive: true } : false
                )
            }
        } else {
            // noinspection JSDeprecatedSymbols
            darkMediaQuery.addListener(darkMediaListener)
            // noinspection JSDeprecatedSymbols
            lightMediaQuery.addListener(lightMediaListener)

            return () => {
                // noinspection JSDeprecatedSymbols
                darkMediaQuery.removeListener(darkMediaListener)
                // noinspection JSDeprecatedSymbols
                lightMediaQuery.removeListener(lightMediaListener)
            }
        }
    }, [])

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (document.documentElement.getAttribute(ATTR) != null)
                setSwitchShowsDark(
                    document.documentElement.getAttribute(ATTR) === "dark"
                )
        })

        observer.observe(document.documentElement, {
            attributeFilter: [ATTR],
            attributes: true,
        })

        return () => observer.disconnect()
    }, [switchShowsDark])

    return (
        <div className={darkModeSwitchStyles.themeSwitchWrapper}>
            <p>Light mode</p>
            <label className={darkModeSwitchStyles.themeSwitch} htmlFor={id}>
                <input
                    type="checkbox"
                    id={id}
                    checked={switchShowsDark}
                    onChange={event => {
                        const switchShowing = event.target.checked
                            ? "dark"
                            : "light"
                        if (
                            localStorage.getItem(CURRENT_THEME) !==
                            switchShowing
                        ) {
                            setSwitchShowsDark(event.target.checked)
                            localStorage.setItem(CURRENT_THEME, switchShowing)
                        }

                        if (localStorage.getItem(OS_THEME) === switchShowing)
                            // If the switch now matches the OS default, remove the USER
                            // override
                            localStorage.removeItem(USER_THEME)
                        else if (
                            localStorage.getItem(USER_THEME) !== switchShowing
                        )
                            // If the switch is different than the OS default and the USER
                            // override is different than what the switch now shows, set
                            // the USER override
                            localStorage.setItem(USER_THEME, switchShowing)

                        if (
                            document.documentElement.getAttribute(ATTR) !==
                            switchShowing
                        )
                            document.documentElement.setAttribute(
                                ATTR,
                                switchShowing
                            )
                    }}
                />
                <div
                    className={`${darkModeSwitchStyles.slider} ${darkModeSwitchStyles.round}`}
                />
            </label>
            <p>Dark mode</p>
        </div>
    )
}
