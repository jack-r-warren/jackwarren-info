import React from "react"
import { Link } from "gatsby"
import _ from "lodash"

/**
 *
 * @param slug the input slug based on the filesystem
 * @returns {string} the output name, essentially just start-cased but possibly
 * with alterations
 */
export function slugToProperCase(slug) {
    const allCaps = ["Csp"]
    return _.startCase(slug.split("/").pop())
        .split(" ")
        .map((s) => (allCaps.includes(s) ? s.toUpperCase() : s))
        .join(" ")
}

export function categoryString(post, prefix = "In", suffix = "") {
    if (post.fields.categories.length === 0) return null
    return [
        <>
            {prefix.length > 0 ? prefix + " " : prefix}
            {post.fields.categories
                .map((cat) => (
                    <Link key={cat} to={cat}>
                        {slugToProperCase(cat)}
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
            .map((tag) => (
                <Link key={tag} to={`/tags/${_.kebabCase(tag)}`}>
                    {tag}
                </Link>
            ))
            .reduce((prev, curr) => [prev, ", ", curr]),
    ]
}
