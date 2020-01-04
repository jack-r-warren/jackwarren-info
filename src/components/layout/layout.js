import React from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery } from "gatsby"

import Header from "./header/header"
import DarkModeSwitch from "./dark-mode-switch/dark-mode-switch"
import "./layout.scss"
import layoutStyles from "./layout.module.scss"

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                    author
                }
            }
        }
    `)

    return (
        <>
            <Header siteTitle={data.site.siteMetadata.title} />
            <main className={layoutStyles.mainBox}>{children}</main>
            <footer className={layoutStyles.footer}>
                <DarkModeSwitch />
                Copyright {new Date().getFullYear()}{" "}
                {data.site.siteMetadata.author}
            </footer>
        </>
    )
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
