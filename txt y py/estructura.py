import os
import argparse
from datetime import datetime

def generar_estructura(directorio, archivo_salida="estructura.txt", ignorar=None):
    """
    Genera la estructura de carpetas y archivos en un archivo de texto.
    
    Args:
        directorio (str): Ruta del directorio a escanear
        archivo_salida (str): Nombre del archivo de salida
        ignorar (list): Lista de nombres de carpetas/archivos a ignorar
    """
    if ignorar is None:
        ignorar = ['.git', '__pycache__', '.idea', 'node_modules', '.vscode']
    
    with open(archivo_salida, 'w', encoding='utf-8') as f:
        # Escribir encabezado
        f.write(f"ESTRUCTURA DE CARPETAS\n")
        f.write(f"Directorio: {directorio}\n")
        f.write(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 80 + "\n\n")
        
        # Recorrer el directorio
        for root, dirs, files in os.walk(directorio):
            # Filtrar carpetas ignoradas
            dirs[:] = [d for d in dirs if d not in ignorar]
            
            # Calcular nivel de profundidad
            nivel = root.replace(directorio, '').count(os.sep)
            indent = '    ' * nivel
            
            # Obtener nombre de la carpeta actual
            nombre_carpeta = os.path.basename(root)
            if nombre_carpeta:
                f.write(f"{indent}📁 {nombre_carpeta}/\n")
            
            # Escribir archivos con indentación
            indent_archivos = '    ' * (nivel + 1)
            for archivo in files:
                # Ignorar archivos específicos si se desea
                if archivo not in ignorar:
                    f.write(f"{indent_archivos}📄 {archivo}\n")
            
            # Agregar línea en blanco para legibilidad
            if files:
                f.write("\n")
    
    print(f"✓ Estructura generada exitosamente en: {archivo_salida}")

def main():
    parser = argparse.ArgumentParser(description='Genera la estructura de una carpeta en un archivo de texto')
    parser.add_argument('directorio', nargs='?', default='.', 
                       help='Ruta del directorio (por defecto: directorio actual)')
    parser.add_argument('-o', '--output', default='estructura.txt',
                       help='Nombre del archivo de salida (por defecto: estructura.txt)')
    parser.add_argument('-i', '--ignore', nargs='+',
                       help='Carpetas/archivos a ignorar (ej: -i .git __pycache__)')
    
    args = parser.parse_args()
    
    # Directorio por defecto: actual
    directorio = os.path.abspath(args.directorio)
    
    if not os.path.exists(directorio):
        print(f"❌ Error: El directorio '{directorio}' no existe")
        return
    
    if not os.path.isdir(directorio):
        print(f"❌ Error: '{directorio}' no es un directorio")
        return
    
    # Configurar ignorados
    ignorar = ['.git', '__pycache__', '.idea', 'node_modules', '.vscode', '.DS_Store']
    if args.ignore:
        ignorar.extend(args.ignore)
    
    # Generar estructura
    generar_estructura(directorio, args.output, ignorar)

if __name__ == "__main__":
    main()