import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const links = [{ url: '/', changefreq: 'daily', priority: 1.0 }];

    // const builds = await WeaveApi.getBuilds();

    // builds.forEach((build) => {
    //     links.push({
    //         url: `/product/${product.id}`,
    //         changefreq: 'daily',
    //         priority: 0.9,
    //     });
    // });

    const stream = new SitemapStream({
        hostname: `https://${req.headers.host}`,
    });

    res.writeHead(200, {
        'Content-Type': 'application/xml',
    });

    // return a promise that resolves with your sitemap
    // which will be sent to the response stream as soon as it's ready
    const xmlString = await streamToPromise(
        Readable.from(links).pipe(stream),
    ).then((data) => data.toString());

    res.end(xmlString);
};
