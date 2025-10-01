Простая работа с циклами.

Библиотка javascript/typescript (ES6) для node.js.

- бесконечный цикл loop с возможностью выхода,
- асинхронная пауза.

# Установка

```
npm install lib-loop
```

или

```
yarn add lib-loop
```

# Начало работы

Можно импортировать методы как с отдельные функции:

```
import { loop, wait } from 'lib-loop';

loop...
wait...
```

или вызывать их как статические методы объекта:

```
import * as loop from 'lib-loop';

loop.loop...
loop.wait...
```

# Список методов

**async iterate(callback: () => void, maxIterations, milliseconds = 0): void**

Запускает цикл.

В цикле вызывается функция callback.

Второй аргумент задает количество итераций. Если задать ноль или отрицательное число, то цикл не запустится.

Третьим необязательным аргументом можно передать задержку между итерациями.

**async loop(callback: () => boolean, milliseconds = 0): void**

Запускает бесконечный цикл.

В цикле вызывается функция callback, пока она возвращает true.

Цикл завершится, когда функция callback вернет false.

Вторым необязательным аргументом можно передать задержку между итерациями.

**async wait(milliseconds: number): void**

Пауза для асинхронного кода.

# Класс управляемого цикла

**constructor(main: (this) => void): void**

Создает цикл.

В цикле задается функция main, которая будет вызываться в каждой итерации.

В аргумент функции main передается ссылка на текущий экземпляр управляемого цикла. Таким образом, можно управлять циклом из функции main.

**context: any**

Свойство, хранящее любые пользовательские состояния цикла.

По-умолчанию - пустой объект.

**iterate: number**

Свойство, хранящее порядковый номер итерации, начиная с 0.

Значение -1 показывает, что ни одна итерация еще не была запущена.

**async start(callback: (this) => void): void**

Запускает цикл.

Перед запуском цикла вызывается функция callback.

По-умолчанию callback задан как пустая функция.

**async stop(callback: (this) => void): void**

Останавливает цикл.

После остановки вызывается функция callback.

По-умолчанию callback задан как пустая функция.

**async next(callback: (this) => void): void**

Продолжает цикл, переходит к следующей итерации.

Перед запуском вызывается функция callback.

По-умолчанию callback задан как пустая функция.

**async wait(milliseconds: number): void**

Алиас метода **wait**, который можно вызвать как метод класса.

# Примеры

# Бесконечный цикл

Предположим, у нас есть асинхронная функция **main**:

```
async function main() {
  if (...) {
    return false;
  }
  return true;
}
```

Запускать эту функцию в цикле можно самым простым способом, даже прямо из тела индексного файла:

```
loop(main);
```

Эквивалентный способ:

```
(async () => loop(main))();
```

Если функция **main** синхронная:

```
function main(): boolean {
  if (...) {
    return false;
  }
  return true;
}
```

Ее нужно запускать внутри асинхронного вызова:

```
loop(async () => main());
```

Допускается запускать внутри синхронный вызов:

```
loop(() => {
  ...
  return true;
});
```

или синхронную функцию:

```
loop(main);
```

# Несколько циклов

Т.к. данный цикл асинхронный, то несколько циклов подряд будут запускаться параллельно.

Если вы хотите запускать их последовательно, вам нужно вызывать их через **await**:

```
await loop(...);
await loop(...);
```

или:

```
(async () => {
  await loop(...);
  await loop(...);
})();
```

# Обработка ошибок

Обработку ошибок можно сделать так:

```
loop(() => main().catch((e) => {
  console.error(e);
  return false;
}));
```

# Цикл и заданным количеством итераций

Возьмем пример из бесконечного цикла и сделаем цикл с заданным количеством итераций, например **10**:

```
async function main() {
  ...
}

iterate(main, 10);
```

# Пример управляемого цикла

Создадим простой управляемый цикл.

Определим функцию, которая будет выполняться в каждой итерации:

```
async function main(self: Infinite) {
  console.log(self.iterate);

  if (self.iterate >= 9) {
    self.stop();
  }

  self.next();
}
```

Далее создадим цикл и запустим его:

```
const infinite = new Infinite(main);

infinite.start();
```

Добавим паузу в 1 секунду между итерациями и вывод в консоль служебных сообщений:

```
async function main(self: Infinite) {
  console.log(self.iterate);

  if (self.iterate >= 9) {
    self.stop(() => {
      console.log('Цикл остановлен')
    });
  }

  await self.wait(1000);
  self.next();
}

const infinite = new Infinite(main);

infinite.start(() => {
  console.log('Цикл запущен')
});
```

Создадим более сложный управляемый цикл. Здесь будет запуск, пауза, возобоновление и полная остановка.

```
async function main(self: Infinite) {
  const { iterate, context } = self;

  console.log(iterate);

  if (iterate >= 9 && !context.paused) {
    self.stop(async () => {
      context.paused = true;
      console.log('Цикл временно приостановлен');

      await self.wait(1000);

      self.start(() => {
        console.log('Цикл продолжен');
      });
    });
  }

  if (iterate >= 19 && !context.stopped) {
    self.stop(() => {
      context.stopped = true;
      console.log('Цикл завершен');
    });
  }

  await self.wait(100);
  self.next();
};

const infinite = new Infinite(main);

infinite.context.paused = false;
infinite.context.stopped = false;

infinite.start(() => {
  console.log('Цикл запущен');
});
```

# Пауза в цикле

Самый простой и правильный способ - задать паузу вторым аргументом:

```
loop(main, 1000)
```

Можно также добавлять задержки внутри кода исполняемой логики, например в функции main:

```
async function main() {
  if (...) {
    return false;
  }

  await wait(1000);

  return true;
}
```

# Лицензия

Лицензия MIT, 2025
