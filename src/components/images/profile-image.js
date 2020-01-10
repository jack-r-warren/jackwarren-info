import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

const ProfileImage = () => {
    const data = useStaticQuery(graphql`
        query {
            placeholderImage: file(relativePath: { eq: "profile.jpg" }) {
                childImageSharp {
                    fluid(maxWidth: 300) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `)

    return <Img fluid={data.placeholderImage.childImageSharp.fluid} />
}

export default ProfileImage
