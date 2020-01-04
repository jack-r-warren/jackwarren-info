import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const PostList = ({ postNodes }) => {
    return (
        <div>
            {postNodes.map(node => (
                <div key={node.fields.slug}>
                    <h2>
                        <Link to={node.fields.slug}>{node.fields.title}</Link>
                    </h2>
                    <p>
                        {node.excerpt}{" "}
                        <Link to={node.fields.slug}>Read&nbsp;more&nbsp;→</Link>
                    </p>
                </div>
            ))}
        </div>
    )
}

PostList.propTypes = {
    postNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default PostList
