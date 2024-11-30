// PageMeta.tsx: Set the app title, decription and meta content
import { Helmet } from "react-helmet-async";

interface PageMetaInterface {
  children: React.ReactNode;
  title: string;
  description: string;
}

const PageMeta: React.FC<PageMetaInterface> = ({
  children,
  title = "",
  description,
}) => {
  // later title and description won't be necessary has that would be depended on the sitemap
  return (
    <>
      <Helmet>
        {(title && (
          <title>
            {title} {title && "- Zenos"}
          </title>
        )) || <title>loading...</title>}
        <link rel="icon" type="image/svg+xml" href={"/assets/images/favicon.svg"} />
        <link rel="canonical" href={window.location.origin} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={URL of the image you want to use} /> */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* <meta name="twitter:image" content={URL of the image you want to use} /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {children}
    </>
  );
};
export default PageMeta;
