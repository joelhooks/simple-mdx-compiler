import * as React from 'react'

export const Wrapper = (props) => (<mjml>
    <mj-head>
      <mj-font name="Inter" 
    // href="https://fonts.googleapis.com/css?family=Inter"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"/>
      <mj-font name="JetBrains Mono" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"/>
      <mj-attributes>
        <mj-column />
        <mj-all font-family="Inter, sans-serif"/>
        <mj-text font-size="16px" line-height="1.8" color="#0A2649"/>
      </mj-attributes>
      <mj-style inline="inline">{``}</mj-style>
      <mj-raw>
        <meta name="color-scheme" content="light"/>
        <meta name="supported-color-schemes" content="light"/>
      </mj-raw>
    </mj-head>
    <mj-body background-color="#ffffff">
      {/* header */}
      <mj-section padding="0">
        <mj-column>
          <mj-image padding="0" src="https://res.cloudinary.com/typescript-course/image/upload/v1643999427/TypeScript%20Email%20Course/email-header_2x.png"/>
        </mj-column>
      </mj-section>
      {/* content */}
      <mj-section>
        <mj-column>{props.children}</mj-column>
      </mj-section>
    </mj-body>
  </mjml>)