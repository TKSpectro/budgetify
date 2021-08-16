import { useRouter } from 'next/router';
import { Button } from './UI/Button';

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
    <Button type="button" onClick={handleChange}>
      ThemeSwitch
    </Button>
  );
}
