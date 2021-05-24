import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import postListStyles from "./post-list.module.scss"
import { categoryString } from "../../util/post-util"

const PostList = ({ postNodes, showCategories }) => {
    return (
        <div>
            {postNodes.map((node) => (
                <div key={node.fields.slug}>
                    {showCategories && (
                        <h4 className={postListStyles.postInfo}>
                            {categoryString(node, "From", "")}
                        </h4>
                    )}
                    <h2 className={postListStyles.postTitle}>
                        <Link to={node.fields.slug}>{node.fields.title}</Link>
                    </h2>
                    <p className={postListStyles.postExcerpt}>
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
    showCategories: PropTypes.bool,
}

PostList.defaultProps = {
    showCategories: true,
}

export default PostList
