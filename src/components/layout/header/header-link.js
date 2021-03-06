import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import headerLinkStyles from "./header-link.module.scss"

const HeaderLink = ({ title, link }) => (
    <h3 className={headerLinkStyles.headerLink}>
        <Link to={link}>{title}</Link>
    </h3>
)

HeaderLink.propTypes = {
    title: PropTypes.string,
    link: PropTypes.string,
}

HeaderLink.defaultProps = {
    title: ``,
    link: ``,
}

export default HeaderLink
