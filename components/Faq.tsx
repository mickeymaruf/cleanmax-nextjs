"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  /** Rich text answer, rendered as HTML (merchant-editable) */
  answer: string;
}

export interface FaqProps {
  /** Heading (merchant-editable) */
  heading: string;
  /** FAQ items (merchant-editable blocks) */
  items: FaqItem[];
}

export default function Faq({ heading, items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#eef2ff] py-16 px-5 text-gray-800" aria-labelledby="product-faq-heading">
      <div className="max-w-2xl mx-auto">
        <h2 id="product-faq-heading" className="text-center mb-10 text-xl font-bold text-gray-800">
          {heading}
        </h2>

        <div>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;

            return (
              <div key={i} className={`border-b border-gray-300 ${i === 0 ? "border-t" : ""}`}>
                <button
                  type="button"
                  className="group w-full py-5 bg-none border-none flex justify-between items-center text-left text-[16px] font-bold text-gray-700 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className="ml-3 text-sm font-light transition-transform duration-200" aria-hidden="true">
                    {isOpen ? "➖" : "➕"}
                  </span>
                </button>

                <div
                  id={panelId}
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="pb-5 leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
