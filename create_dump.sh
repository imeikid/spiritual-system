#!/bin/bash
DUMP_FILE="spiritual_system_dump.txt"
echo "=== SPIRITUAL SYSTEM PROJECT DUMP ===" > $DUMP_FILE
echo "Path: $(pwd)" >> $DUMP_FILE
echo "Generated: $(date)" >> $DUMP_FILE
echo "=====================================" >> $DUMP_FILE

# Package info
echo -e "\n📦 PACKAGE.JSON:" >> $DUMP_FILE
cat package.json >> $DUMP_FILE

# Source files
echo -e "\n🔧 SOURCE CODE:" >> $DUMP_FILE
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.json" | while read file; do
    echo -e "\n--- $file ---" >> $DUMP_FILE
    cat "$file" >> $DUMP_FILE
done

echo "✅ Dump created: $DUMP_FILE"
