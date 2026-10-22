'use client';

// The Cirvola Cookbook: filters and recipe dialogs (deep-linkable with /recipes#recipe-id).

import { useEffect, useRef, useState } from 'react';
import type { recipes as recipeData } from '@/content/recipes';
import { Icon } from '../Icon';
import { Txt } from '../Text';

type Recipe = (typeof recipeData)[number];

const kindName: Record<string, string> = { food: 'Food', drink: 'Drink', household: 'Household, not for eating' };
const filters = [
  ['all', 'All'],
  ['food', 'Food'],
  ['drink', 'Drinks'],
  ['household', 'Household'],
];

function RecipeDialog({ r, onClosed }: { r: Recipe; onClosed: () => void }) {
  return (
    <dialog
      className="recipe-dialog"
      id={r.id}
      data-recipe-dialog=""
      aria-labelledby={`${r.id}-title`}
      // click on the backdrop closes
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      onClose={onClosed}
    >
      <div className="recipe-sheet">
        <button
          type="button"
          className="icon-btn recipe-close"
          data-dialog-close=""
          aria-label="Close recipe"
          onClick={(e) => e.currentTarget.closest('dialog')?.close()}
        >
          <Icon name="close" />
        </button>
        <img className="recipe-hero" src={r.image} alt={r.alt} loading="lazy" />
        <div className="recipe-content">
          <p className="recipe-status">{kindName[r.kind]}</p>
          <h2 id={`${r.id}-title`}>{r.title}</h2>
          <p className="recipe-lead">
            <Txt text={r.intro} />
          </p>
          <dl className="recipe-facts">
            <div>
              <dt>Starts as</dt>
              <dd>{r.from}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>
                <Txt text={r.time} />
              </dd>
            </div>
            <div>
              <dt>Makes</dt>
              <dd>
                <Txt text={r.serves} />
              </dd>
            </div>
          </dl>
          <div className="recipe-columns">
            <div>
              <h3>You’ll need</h3>
              <ul className="ingredients">
                {r.ingredients.map((i, n) => (
                  <li key={n}>
                    <Txt text={i} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>How we make it</h3>
              <ol className="method">
                {r.steps.map((s, n) => (
                  <li key={n}>
                    <Txt text={s} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {r.tip && (
            <p className="recipe-tip">
              <strong>Cirvola tip.</strong>
              <Txt text={` ${r.tip}`} />
            </p>
          )}
          <p className={`recipe-allergens${r.kind === 'household' ? ' is-warning' : ''}`}>
            <Icon name="warning" size={18} />
            <span>
              <Txt text={r.allergens} />
            </span>
          </p>
        </div>
      </div>
    </dialog>
  );
}

export function Cookbook({ recipes, intro }: { recipes: Recipe[]; intro: string }) {
  const [filter, setFilter] = useState('all');
  const lastOpener = useRef<HTMLElement | null>(null);

  function openRecipe(id: string, opener: HTMLElement | null) {
    const dlg = document.getElementById(id) as HTMLDialogElement | null;
    if (!dlg || typeof dlg.showModal !== 'function') return;
    lastOpener.current = opener;
    dlg.showModal();
    dlg.querySelector('.recipe-sheet')!.scrollTop = 0;
    history.replaceState(history.state, '', `#${id}`);
  }

  function onClosed() {
    history.replaceState(history.state, '', location.pathname + location.search);
    lastOpener.current?.focus();
  }

  useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash && recipes.some((r) => r.id === hash)) {
      openRecipe(hash, document.querySelector<HTMLElement>(`[data-recipe-open="${hash}"]`));
    }
  }, [recipes]);

  return (
    <section className="section cookbook" id="cookbook" aria-labelledby="cookbook-title">
      <div className="wrap">
        <div className="section-head section-head-row">
          <div>
            <h2 className="section-title" id="cookbook-title">The Cirvola Cookbook</h2>
            <p className="section-intro">{intro}</p>
          </div>
          <div className="filter-set" role="group" aria-label="Filter recipes">
            {filters.map(([v, l]) => (
              <button type="button" className="filter" data-filter={v} aria-pressed={filter === v ? 'true' : 'false'} key={v} onClick={() => setFilter(v)}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <ul className="recipe-grid" data-recipe-grid="">
          {recipes.map((r) => (
            <li className="recipe-card" data-kind={r.kind} key={r.id} hidden={filter !== 'all' && r.kind !== filter}>
              <button type="button" className="recipe-open" data-recipe-open={r.id} aria-haspopup="dialog" onClick={(e) => openRecipe(r.id, e.currentTarget)}>
                <span className="recipe-media">
                  <img src={r.image} alt={r.alt} loading="lazy" />
                </span>
                <span className="recipe-info">
                  <span className="recipe-status">{r.status}</span>
                  <span className="recipe-title">{r.title}</span>
                  <span className="recipe-from">{`From ${r.from.toLowerCase()}`}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="cookbook-note">
          Cook with care: wash everything, use by-products on the day they’re produced or store them chilled, and never use plate leftovers. Check every recipe for
          allergens.
        </p>
      </div>
      {recipes.map((r) => (
        <RecipeDialog r={r} key={r.id} onClosed={onClosed} />
      ))}
    </section>
  );
}
