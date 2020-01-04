import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import headerStyles from "./header.module.scss"
import HeaderLink from "./header-link"

const Header = ({ siteTitle }) => (
    <header className={headerStyles.headerBar}>
        <div className={headerStyles.siteTitle}>
            <h1>
                <Link to="/">{siteTitle}</Link>
            </h1>
        </div>
        <div className={headerStyles.headerLinks}>
            <HeaderLink title="Projects" link="/posts/projects" />
            <HeaderLink title="Contact" link="/contact" />
        </div>
    </header>
)

Header.propTypes = {
    siteTitle: PropTypes.string,
}

Header.defaultProps = {
    siteTitle: ``,
}

export default Header
