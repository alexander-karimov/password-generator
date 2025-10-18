## Генератор паролей по шаблону (TypeScript/JavaScript)

Лёгкая утилита без зависимостей для генерации паролей по шаблону.
Поддерживает безопасную генерацию через Web Crypto с корректным распределением (rejection sampling) и опциональную перетасовку символов.

✨ Шаблоны: L4N6S4, L4-N6-S4, L4 N6 S4;

🔤 Преднастроенные пулы: заглавные L, строчные l, цифры N, символы S;

🧩 Свои пулы и произвольные буквенные ключи;

🔐 Безопасная случайность в браузере и Node 18+;

### Использование

```tsx
import { getRandomPassword } from "../utils";

// Базовый шаблон.
const basePassword = getRandomPassword("L2l2N4S2");

// Кастомные пулы + перемешивание результата.
const customPassword = getRandomPassword("L2l2N4S2", {
    pools: {
        L: "ABCDEFGHJKMNPQRSTUVWXYZ", // без I, O
        l: "abcdefghjkmnpqrstuvwxyz", // без l, o
        N: "23456789", // без 0, 1
        S: "!@#$%&*~",
    },
    shuffle: true,
});
```
