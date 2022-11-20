import React from "react"

import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"
import ClickToCopy from "../components/click-to-copy/click-to-copy"
import { graphql } from "gatsby"

import contactStyles from "./contact.module.scss"

const ContactPage = ({ data }) => {
    const {
        authorLinkedIn,
        authorKeybase,
        email,
        siteRepository,
    } = data.site.siteMetadata

    return (
        <Layout>
            <Metadata
                title={"Contact"}
                description={
                    "See this page for different ways to drop me a line"
                }
            />
            <h1>Contact</h1>
            <p>
                The form below will shoot me an email, or you can take your pick
                of the following:
            </p>
            <ul>
                <li>
                    Email me directly at <a href={`mailto:${email}`}>{email}</a>{" "}
                    <span className={contactStyles.nowrap}>
                        (<ClickToCopy copy={email} />)
                    </span>
                </li>
                <li>
                    Message me on Mastodon at{" "}
                    <a
                        className={contactStyles.nowrap}
                        href={`https://hachyderm.io/@jackwarren`}
                    >
                        @jackwarren@hachyderm.io
                    </a>
                </li>
                <li>
                    Find me on{" "}
                    <a href={`https://www.linkedin.com/in/${authorLinkedIn}`}>
                        LinkedIn
                    </a>
                </li>
                <li>
                    See my PGP public key on{" "}
                    <a href={`https://keybase.io/${authorKeybase}`}>Keybase</a>{" "}
                </li>
            </ul>
            <form
                name="contact"
                method="post"
                // Gatsby makes this from src/pages/contact/thanks.js
                action="/contact/thanks"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
            >
                <h2>Send a Message</h2>
                <input type="hidden" name="form-name" value="contact" />
                <p>
                    <label htmlFor="name">Name:</label>
                    <br />
                    <input type="text" name="name" id="name" />
                </p>
                <p>
                    <label htmlFor="email">Email:</label>
                    <br />
                    <input type="email" name="email" id="email" required />
                </p>
                <p>
                    <label htmlFor="message">Message:</label>
                    <br />
                    <textarea name="message" id="message" required />
                </p>
                <button type="submit">
                    <h4>Send</h4>
                </button>
            </form>
        </Layout>
    )
}

export const query = graphql`
    query ContactQuery {
        site {
            siteMetadata {
                authorTwitter
                authorLinkedIn
                authorKeybase
                email
                siteRepository
            }
        }
    }
`

export default ContactPage
