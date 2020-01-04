import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import paginatedNavigationStyles from "./paginated-navigation.module.scss"

function linkTo(base, number) {
    return number === 1 ? base : `${base}/${number}`
}

const PaginatedNavigation = ({ selfPage, totalPages, baseSlug, noMargin }) => {
    if (totalPages <= 1) return false
    return (
        <div
            className={`${noMargin ? paginatedNavigationStyles.noMargin : ""} ${
                paginatedNavigationStyles.container
            }`}
        >
            <h4
                className={`${
                    selfPage <= 1 ? paginatedNavigationStyles.hidden : ""
                } ${paginatedNavigationStyles.left}`}
            >
                <Link to={linkTo(baseSlug, selfPage - 1)}>← Previous</Link>
            </h4>
            <h4
                className={paginatedNavigationStyles.center}
            >{`Page ${selfPage} of ${totalPages}`}</h4>
            <h4
                className={`${
                    selfPage >= totalPages
                        ? paginatedNavigationStyles.hidden
                        : ""
                } ${paginatedNavigationStyles.right}`}
            >
                <Link to={linkTo(baseSlug, selfPage + 1)}>Next →</Link>
            </h4>
        </div>
    )
}

PaginatedNavigation.propTypes = {
    selfPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    baseSlug: PropTypes.string.isRequired,
    noMargin: PropTypes.bool,
}

PaginatedNavigation.defaultProps = {
    noMargin: false,
}

export default PaginatedNavigation
