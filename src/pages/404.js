import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout/layout"
import Metadata from "../components/layout/metadata"

const NotFoundPage = () => (
    <Layout>
        <Metadata title="404: Not Found" />
        <h1>Oops...</h1>
        <h3>
            That page couldn't be found{" "}
            <span role="img" aria-label="(frowning face emoji)">
                🙁
            </span>
        </h3>
        <Link to={`/`}>Click here to go back home</Link>
    </Layout>
)

export default NotFoundPage
