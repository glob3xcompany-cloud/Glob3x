/** Renders a schema.org graph. Next keeps the script in the streamed HTML, which is what crawlers read. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
