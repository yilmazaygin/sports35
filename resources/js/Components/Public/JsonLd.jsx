import { Head } from '@inertiajs/react';

export default function JsonLd({ data }) {
    if (!data) {
        return null;
    }

    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(data)}</script>
        </Head>
    );
}
