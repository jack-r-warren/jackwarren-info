import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import _ from "lodash"

const TagList = ({ countMap, showTitle, className }) => {
    const tagLinks = _.toPairs(countMap)
        .sort((a, b) => b[1] - a[1])
        .reduce((soFar, pair) => {
            const tag = pair[0]
            const count = pair[1]
            soFar.push(
                <span key={tag}>
                    <Link
                        to={`/tags/${_.kebabCase(tag)}`}
                    >{`${tag} (${count})`}</Link>
                    <br />
                </span>
            )
            return soFar
        }, [])
    return tagLinks.length > 0 ? (
        <div className={className}>
            {showTitle && <h3>Related Tags</h3>}
            {tagLinks}
        </div>
    ) : null
}

TagList.propTypes = {
    countMap: PropTypes.object.isRequired,
    showTitle: PropTypes.bool,
    className: PropTypes.string,
}

TagList.defaultProps = {
    showTitle: true,
    className: "",
}

export default TagList
