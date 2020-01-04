import React from "react"

import styleDemoStyles from "./style-demo.module.scss"
import DarkModeSwitch from "./layout/dark-mode-switch/dark-mode-switch"

const StyleDemo = () => {
    return (
        <div className={styleDemoStyles.styleDemoContainer}>
            <div className={styleDemoStyles.middleBox}>
                <h1>Lorem ipsum dolor sit amet</h1>
            </div>
            <div className={styleDemoStyles.closeBox}>
                <h3>Duis tincidunt mauris at sapien fermentum porta</h3>
                <p>
                    Integer malesuada arcu vel nisi convallis vehicula.{" "}
                    <i>Phasellus scelerisque justo nunc.</i>{" "}
                    <b>Praesent finibus tellus at nunc dapibus elementum.</b>{" "}
                    <code>Phasellus eget fermentum diam.</code>{" "}
                    <span>Phasellus dignissim finibus felis a tristique.</span>
                </p>
            </div>
            <DarkModeSwitch />
        </div>
    )
}

export default StyleDemo
