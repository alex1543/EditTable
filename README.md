# EditTable
Редактор таблиц, главная фишка которого в том, что можно редактировать таблицы на разных скриптовых языках: PHP, Perl, Python, Ruby и т.д. (Go, Lua, Elixir, Dart, Node.js, потом будет доделано ...).

Все языки поддерживают MariaDB/MySQL, но только PHP (PDO) поддерживает три базы данных: MySQL, Microsoft SQL, PostgreSQL.

Главный экран:

![image](https://user-images.githubusercontent.com/10297748/233468988-55e489b6-1931-4f74-9d9c-72bcb7b929e5.png)

Просмотр таблиц:

![image](https://user-images.githubusercontent.com/10297748/233469132-6be058b6-e369-4e2a-8ee7-60eeaa0cf4a4.png)

Редактор одной ячейки:

![image](https://user-images.githubusercontent.com/10297748/233696115-d4051d01-3a54-4748-a651-1cc3be7bd8c8.png)

Сайт гарантированно работает на ApacheFriends XAMPP Version 7.4.27 с предустановленным драйвером PDO и PHP версии 7.4.27. Для работы с PostgreSQL необходимо в файле php.ini найти строку 'extension=pdo_mysql' и после добавить новую строку: extension=php_pdo_pgsql

Сайт может работать и на Perl. Для этого необходимо установить strawberry-perl-5.32.1.1-64bit и добавить в переменную среды Path новый каталог C:\Strawberry\perl\bin\, куда был установлен Perl.

Вид экрана при работе с таблицами через Perl.

![image](https://user-images.githubusercontent.com/10297748/233806376-c619a10f-9550-4049-a13a-dcaf197985e3.png)

Модуль сайта гарантированно работает на perl 5, version 32, subversion 1 (v5.32.1) built for MSWin32-x64-multi-thread. Необходимо доустановить компонент DBI с помощью команды cpan, а потом install DBI в каталоге с Perl.

Поддерживается работа через Ruby. Внешний вид экрана:

![image](https://user-images.githubusercontent.com/10297748/233828976-af11a004-3f1c-4742-96e6-3b569c631755.png)

Для работы через Ruby, необходимо отредактировать первую строку в файле ruby.rb и заменить #!C:\Ruby32-x64\bin\ruby.exe на путь, где был установлен Ruby. Модуль гарантированно работает на ruby 3.2.2 (2023-03-30 revision e51014f9c0) [x64-mingw-ucrt].

Возможна работа через Python. Внешний вид:

![image](https://user-images.githubusercontent.com/10297748/233832764-5ca6d12e-74de-48f9-b2e5-fdc1a2ab076c.png)

Для поддержки Python необходимо отредактировать файл python.py и заменить первую строчку #!c:/Users/днс/AppData/Local/Programs/Python/Python38/python.exe на свой путь, где установлен Python.
