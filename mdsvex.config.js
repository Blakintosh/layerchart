import slug from 'rehype-slug';
import { codePreview } from 'svelte-ux/plugins/remark';

export default {
	extensions: ['.md', '.svx'],
	layout: './src/lib/docs/Layout.svelte',
	remarkPlugins: [codePreview],
	rehypePlugins: [slug]
	// highlight: false
};
