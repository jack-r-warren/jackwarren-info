import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import _ from "lodash"

const TagList = ({ countMap, className }) => {
    return (
        <div className={className}>
            <h3>Related Tags</h3>
            {_.toPairs(countMap)
                .sort((a, b) => b[1] - a[1])
                .reduce((soFar, pair) => {
                    const tag = pair[0]
                    const count = pair[1]
                    soFar.push(
                        <Link
                            key={tag}
                            to={`/tags/${_.kebabCase(tag)}`}
                        >{`${tag} (${count})`}</Link>
                    )
                    soFar.push(<br />)
                    return soFar
                }, [])}
        </div>
    )
}

TagList.propTypes = {
    countMap: PropTypes.object.isRequired,
    className: PropTypes.string,
}

TagList.defaultProps = {
    className: "",
}

export default TagList
