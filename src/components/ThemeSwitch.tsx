import { useRouter } from 'next/router';

// TODO: Really shitty implementation -> build a actual nice looking switch
export function ThemeSwitch() {
  const router = useRouter();

  function handleChange() {
    if (localStorage.getItem('theme') === 'light') {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }

    // TODO: Is there a better way to force refresh of basically all components?
    router.reload();
  }

  return (
    <button type="button" onClick={handleChange}>
      Theme
    </button>
  );
}
