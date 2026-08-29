import { AlertCircle, ChevronDown, Sparkles, Wand2, Zap } from 'lucide-react';
import { useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { ResultDisplay } from '@/components/ResultDisplay';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

const GENERATE_ENDPOINT = '/api/generate';

const SAMPLE_PROMPTS = [
  'на минималистичном мраморном подиуме с брызгами воды, студийный свет',
  'на фоне пастельных облаков, мягкое утреннее освещение',
  'в стиле люкс, золотые акценты, тёмный фон, драматичный свет',
  'в летней атмосфере, тропические листья, яркий солнечный свет',
];

const MARKETPLACES = [
  { value: 'wildberries', label: 'Wildberries' },
  { value: 'ozon', label: 'Ozon' },
];

function App() {
  const { theme, toggleTheme } = useTheme();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [marketplace, setMarketplace] = useState('wildberries');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt.trim());
      formData.append('marketplace', marketplace);

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? `Сервер вернул ошибку ${response.status}`);
      }

      const imageUrl = data?.url ?? null;

      if (!imageUrl) {
        throw new Error('В ответе сервера не найден URL изображения');
      }

      setResultUrl(imageUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultUrl(null);
    setImageFile(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-brand-950/40 dark:text-slate-100">
      {/* Decorative background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/20" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-brand-300/10 blur-3xl dark:bg-brand-500/10" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-lg dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Seller<span className="text-brand-600 dark:text-brand-400">AI</span>
            </span>
          </div>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-16 pb-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/50 px-4 py-1.5 text-xs font-medium text-brand-700 dark:border-brand-800/60 dark:bg-brand-950/50 dark:text-brand-300">
          <Zap className="h-3.5 w-3.5" />
          AI-генерация карточек для маркетплейсов
        </div>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Создавайте продающие{' '}
          <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-300">
            карточки товаров
          </span>{' '}
          за секунды
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
          Загрузите фото товара, опишите идею — и SellerAI сгенерирует готовую
          карточку для Wildberries или Ozon с профессиональным оформлением.
        </p>
      </section>

      {/* Main App Container */}
      <main className="relative z-10 mx-auto max-w-2xl px-5 pb-20">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-900/60 sm:p-8"
        >
          {isLoading && <SkeletonLoader />}

          {/* Drop Zone */}
          <div className="mb-6">
            <label className="mb-2.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Изображение товара
            </label>
            <DropZone
              imageFile={imageFile}
              imageUrl={null}
              onImageChange={setImageFile}
              disabled={isLoading}
            />
          </div>

          {/* Prompt Textarea */}
          <div className="mb-6">
            <label className="mb-2.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Описание сцены (промпт)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={3}
              placeholder="на минималистичном мраморном подиуме с брызгами воды, студийный свет"
              className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setPrompt(sample)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 transition-all hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-300"
                >
                  {sample.length > 32 ? sample.slice(0, 32) + '…' : sample}
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace Select */}
          <div className="mb-6">
            <label className="mb-2.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Маркетплейс
            </label>
            <div className="relative">
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                disabled={isLoading}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 pr-10 text-sm font-medium text-slate-800 transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              >
                {MARKETPLACES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !imageFile || !prompt.trim()}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/40 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Генерация...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Сгенерировать в SellerAI
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            Нажимая кнопку, вы соглашаетесь на обработку данных нейросетью
          </p>
        </form>

        {/* Result */}
        {resultUrl && (
          <div className="mt-8">
            <ResultDisplay imageUrl={resultUrl} onReset={handleReset} />
          </div>
        )}

        {/* Features */}
        {!resultUrl && !isLoading && (
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Zap, title: 'Быстро', desc: 'Готовая карточка за секунды' },
              { icon: Sparkles, title: 'Профессионально', desc: 'Студийное качество изображений' },
              { icon: Wand2, title: 'Гибко', desc: 'Любой промпт и стиль оформления' },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/60 bg-white/50 p-5 text-center backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/40"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 py-6 dark:border-slate-800/60">
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          SellerAI — AI-генератор карточек для маркетплейсов
        </p>
      </footer>
    </div>
  );
}

export default App;
