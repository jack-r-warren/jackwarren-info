import React from "react"
import { Link } from "gatsby"
import _ from "lodash"

export function categoryString(post, prefix = "In", suffix = "") {
    if (post.fields.categories.length === 0) return null
    return [
        <>
            {prefix.length > 0 ? prefix + " " : prefix}
            {post.fields.categories
                .map(cat => (
                    <Link key={cat} to={cat}>
                        {_.startCase(cat.split("/").pop())}
                    </Link>
                ))
                .reduce((prev, current) => [prev, " / ", current])}
            {suffix.length > 0 ? " " + suffix : suffix}
        </>,
    ]
}

export function dateString(post) {
    if (post.fields.date == null) return null
    return [<span key={post.fields.date}>{post.fields.date}</span>]
}

export function tagString(post) {
    if (post.fields.tags.length === 0) return null
    return [
        post.fields.tags
            .map(tag => (
                <Link key={tag} to={`/tags/${_.kebabCase(tag)}`}>
                    {tag}
                </Link>
            ))
            .reduce((prev, curr) => [prev, ", ", curr]),
    ]
}
