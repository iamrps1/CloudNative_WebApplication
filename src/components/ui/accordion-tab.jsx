"use client"

import { useState } from "react"

import CustomAccordion from "./custom-accordion"

const AccordionTab = ({ data, ...props }) => {
    const [expanded, setExpanded] = useState(1)

    return data.map((item) => (
        <CustomAccordion
            key={item.id}
            id={item.id}
            expanded={expanded}
            setExpanded={setExpanded}
            title={item.title}
            content={item.content}
            {...props}
        />
    ))
}

export default AccordionTab
