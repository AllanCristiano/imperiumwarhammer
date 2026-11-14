import { FACTIONS, findFaction } from './factions';

describe('FACTIONS (integridade dos dados)', () => {
  it('tem pelo menos uma facção', () => {
    expect(FACTIONS.length).toBeGreaterThan(0);
  });

  it('usa slugs únicos e seguros para URL', () => {
    const slugs = FACTIONS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('usa glifos únicos', () => {
    const glyphs = FACTIONS.map((f) => f.glyph);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  describe.each(FACTIONS.map((f) => [f.slug, f] as const))('%s', (_slug, f) => {
    it('tem cores hexadecimais válidas', () => {
      expect(f.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(f.accent).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('preenche os textos obrigatórios', () => {
      for (const text of [
        f.name,
        f.short,
        f.epithet,
        f.motto,
        f.summary,
        f.quote.text,
        f.quote.author,
      ]) {
        expect(text.trim()).not.toBe('');
      }
      expect(f.lore.length).toBeGreaterThan(0);
    });

    it('tem 5 atributos entre 0 e 100 (o radar é um pentágono)', () => {
      expect(f.stats).toHaveLength(5);
      for (const s of f.stats) {
        expect(s.label.trim()).not.toBe('');
        expect(s.value).toBeGreaterThanOrEqual(0);
        expect(s.value).toBeLessThanOrEqual(100);
      }
    });

    it('tem fatos e linha do tempo preenchidos', () => {
      expect(f.facts.length).toBeGreaterThan(0);
      expect(f.timeline.length).toBeGreaterThan(0);
      for (const e of f.timeline) expect(e.era).toMatch(/^M\d+(–M\d+)?$/);
    });
  });
});

describe('findFaction', () => {
  it('encontra a facção pelo slug', () => {
    const first = FACTIONS[0];
    expect(findFaction(first.slug)).toBe(first);
  });

  it.each([null, undefined, '', 'nao-existe', 'ADEPTUS-ASTARTES'])(
    'retorna undefined para %j',
    (slug) => {
      expect(findFaction(slug)).toBeUndefined();
    },
  );
});
