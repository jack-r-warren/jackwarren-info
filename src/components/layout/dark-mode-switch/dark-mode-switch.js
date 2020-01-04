import React, { useEffect, useState } from "react"
import _ from "lodash"

import darkModeSwitchStyles from "./dark-mode-switch.module.scss"

function DarkModeSwitch() {
    const [defaultTheme, setDefaultTheme] = useState("light")
    const [currentTheme, setCurrentTheme] = useState("light")
    const [id] = useState(_.uniqueId("dms"))

    // Run once, at runtime in the browser after drawing
    useEffect(() => {
        const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const lightMediaQuery = window.matchMedia(
            "(prefers-color-scheme: light)"
        )

        const calculatedDefaultTheme = darkMediaQuery.matches ? "dark" : "light"
        const calculatedCurrentTheme = localStorage.getItem("theme")

        setDefaultTheme(calculatedDefaultTheme)
        setCurrentTheme(calculatedCurrentTheme || calculatedDefaultTheme)

        const darkMediaListener = event => {
            if (event.matches) setDefaultTheme("dark")
        }
        const lightMediaListener = event => {
            if (event.matches) setDefaultTheme("light")
        }

        // Use the non-deprecated method if it exists
        if (typeof darkMediaQuery.addEventListener === typeof Function) {
            darkMediaQuery.addEventListener("change", darkMediaListener)
            lightMediaQuery.addEventListener("change", lightMediaListener)
        } else {
            // noinspection JSDeprecatedSymbols
            darkMediaQuery.addListener(darkMediaListener)
            // noinspection JSDeprecatedSymbols
            lightMediaQuery.addListener(lightMediaListener)
        }

        // Use a narrowly-configured MutationObserver to track other instances
        // of this component
        const observer = new MutationObserver(() =>
            setCurrentTheme(document.documentElement.getAttribute("data-theme"))
        )
        observer.observe(document.documentElement, {
            attributeFilter: ["data-theme"],
            attributes: true,
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    // Run each time the default theme changes
    useEffect(() => {
        // If we aren't storing a user preference for the theme,
        // update the theme to match the new default
        if (!localStorage.getItem("theme")) setCurrentTheme(defaultTheme)
    }, [defaultTheme])

    // Run each time the current theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", currentTheme)

        // Use local storage only if we need to override the default
        if (defaultTheme !== currentTheme) {
            localStorage.setItem("theme", currentTheme)
        } else if (localStorage.getItem("theme")) {
            localStorage.removeItem("theme")
        }
    }, [defaultTheme, currentTheme])

    return (
        <div className={darkModeSwitchStyles.themeSwitchWrapper}>
            <p>Light mode</p>
            <label className={darkModeSwitchStyles.themeSwitch} htmlFor={id}>
                <input
                    type="checkbox"
                    id={id}
                    checked={currentTheme === "dark"}
                    onChange={() =>
                        setCurrentTheme(
                            currentTheme === "dark" ? "light" : "dark"
                        )
                    }
                />
                <div
                    className={`${darkModeSwitchStyles.slider} ${darkModeSwitchStyles.round}`}
                />
            </label>
            <p>Dark mode</p>
        </div>
    )
}

export default DarkModeSwitch
