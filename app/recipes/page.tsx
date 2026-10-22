import { recipes, cookbookIntro } from '@/content/recipes';
import { lab } from '@/content/lab';
import { BodyClass } from '@/components/site/BodyClass';
import { Studio } from '@/components/recipes/Studio';
import { Cookbook } from '@/components/recipes/Cookbook';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/recipes',
  title: 'Recipes',
  description:
    'Share your food valorisation idea and see it visualised by AI, or cook from the Cirvola Cookbook: calamansi fibre bars, beetroot latte, candied peel and more.',
});

const briefs = lab.briefs.map(({ id, title, material }) => ({ id, title, material }));

export default function RecipesPage() {
  return (
    <>
      <BodyClass name="page-recipes" />
      <Studio briefs={briefs} />
      <Cookbook recipes={recipes} intro={cookbookIntro} />
    </>
  );
}
