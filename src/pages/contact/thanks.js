import React from "react"
import { Link } from "gatsby"

import Layout from "../../components/layout/layout"
import Metadata from "../../components/layout/metadata"

const ContactFormSentPage = () => (
    <Layout>
        <Metadata title="Thanks!" />
        <h1>Message Sent—Thanks!</h1>
        <h3>I'll get back to you as soon as I can</h3>
        <Link to={`/`}>Click here to go back home</Link>
    </Layout>
)

export default ContactFormSentPage
