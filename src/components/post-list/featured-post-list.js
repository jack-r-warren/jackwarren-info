import React from "react"
import Img from "gatsby-image"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import featuredPostListStyles from "./featured-post-list.module.scss"

const FeaturedPostList = ({ postNodes }) => {
    return postNodes.length > 0 ? (
        <div className={featuredPostListStyles.featurePostsContainer}>
            {postNodes.map(node => (
                <div
                    className={featuredPostListStyles.postItem}
                    key={node.fields.title}
                >
                    <Link to={node.fields.slug}>
                        <Img
                            className={featuredPostListStyles.featuredImage}
                            fluid={
                                node.fields.featuredImage.childImageSharp.fluid
                            }
                        />
                    </Link>
                    <h2 className={featuredPostListStyles.postTitle}>
                        <Link to={node.fields.slug}>{node.fields.title}</Link>
                    </h2>
                    <p>
                        {node.excerpt}{" "}
                        <Link to={node.fields.slug}>Read&nbsp;more&nbsp;→</Link>
                    </p>
                </div>
            ))}
        </div>
    ) : null
}

FeaturedPostList.propTypes = {
    postNodes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default FeaturedPostList
