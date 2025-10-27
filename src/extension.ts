import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Активация плагина "My Simple Plugin"');

    // Команда Hello World
    let helloWorldCommand = vscode.commands.registerCommand('my-simple-plugin.helloWorld', () => {
        vscode.window.showInformationMessage('Привет от моего первого плагина для VS Code! 🎉');
    });

    // Команда показа текущего времени
    let showTimeCommand = vscode.commands.registerCommand('my-simple-plugin.showTime', () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU');
        const dateString = now.toLocaleDateString('ru-RU');
        
        vscode.window.showInformationMessage(`Текущее время: ${timeString}, Дата: ${dateString}`);
        console.log(`Плагин показал время: ${timeString}`);
    });

    // Улучшенная команда для анализа текущего файла
    let analyzeFileCommand = vscode.commands.registerCommand('my-simple-plugin.analyzeFile', () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('Нет активного редактора!');
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lineCount = document.lineCount;
        const fileName = document.fileName.split(/[\\/]/).pop() || 'Неизвестный файл';
        const fileExtension = path.extname(document.fileName);
        const languageId = document.languageId;
        
        // Подсчет статистики
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        const charCount = text.length;
        const charCountWithoutSpaces = text.replace(/\s+/g, '').length;
        
        // Подсчет пустых строк
        let emptyLines = 0;
        for (let i = 0; i < lineCount; i++) {
            const line = document.lineAt(i);
            if (line.text.trim().length === 0) {
                emptyLines++;
            }
        }

        // Анализ выделенного текста (если есть)
        const selection = editor.selection;
        let selectionInfo = 'Нет выделения';
        if (!selection.isEmpty) {
            const selectedText = document.getText(selection);
            const selectedLines = selection.end.line - selection.start.line + 1;
            const selectedWords = selectedText.split(/\s+/).filter(word => word.length > 0).length;
            const selectedChars = selectedText.length;
            selectionInfo = `Выделено: ${selectedLines} строк, ${selectedWords} слов, ${selectedChars} символов`;
        }

        // Создание информационного сообщения
        const analysisResult = `
📊 Анализ файла: ${fileName}

📁 Расширение: ${fileExtension || 'нет'}
🔤 Язык: ${languageId}
📝 Строк всего: ${lineCount}
📄 Пустых строк: ${emptyLines}
📈 Строк с кодом: ${lineCount - emptyLines}
🔠 Слов: ${wordCount}
📏 Символов: ${charCount} (без пробелов: ${charCountWithoutSpaces})
🎯 ${selectionInfo}
        `.trim();

        // Показываем результат в информационном сообщении
        vscode.window.showInformationMessage(analysisResult);

        // Также выводим в панель вывода для более детального просмотра
        const outputChannel = vscode.window.createOutputChannel('Анализ файла');
        outputChannel.show();
        outputChannel.appendLine('=== РЕЗУЛЬТАТЫ АНАЛИЗА ФАЙЛА ===');
        outputChannel.appendLine(`Файл: ${fileName}`);
        outputChannel.appendLine(`Путь: ${document.fileName}`);
        outputChannel.appendLine(`Язык: ${languageId}`);
        outputChannel.appendLine(`Строк: ${lineCount} (пустых: ${emptyLines})`);
        outputChannel.appendLine(`Слов: ${wordCount}`);
        outputChannel.appendLine(`Символов: ${charCount} (без пробелов: ${charCountWithoutSpaces})`);
        outputChannel.appendLine(`Размер: ${(charCount / 1024).toFixed(2)} KB`);
        outputChannel.appendLine(selectionInfo);
        outputChannel.appendLine('================================');
    });

    // Команда для быстрого анализа (только основные метрики)
    let quickAnalyzeCommand = vscode.commands.registerCommand('my-simple-plugin.quickAnalyze', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('Нет активного редактора!');
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lineCount = document.lineCount;
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        // Быстрый анализ - показываем в статус баре
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = `📊 ${lineCount} строк, ${wordCount} слов`;
        statusBarItem.tooltip = 'Быстрый анализ файла';
        statusBarItem.show();
        
        // Скрываем через 5 секунд
        setTimeout(() => {
            statusBarItem.hide();
            statusBarItem.dispose();
        }, 5000);
    });

    // Добавляем команды в контекст
    context.subscriptions.push(helloWorldCommand);
    context.subscriptions.push(showTimeCommand);
    context.subscriptions.push(analyzeFileCommand);
    context.subscriptions.push(quickAnalyzeCommand);
}

export function deactivate() {
    console.log('Деактивация плагина "My Simple Plugin"');
}