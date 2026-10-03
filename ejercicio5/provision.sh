#!/bin/bash
set -e
echo "[1/4] Actualizando catálogo..."
sudo apt-get update -qq
echo "[2/4] Instalando paquetes..."
sudo apt-get install -y -qq nginx curl git htop
echo "[3/4] Configurando página..."
echo "<h1>Servidor aprovisionado automáticamente</h1><p>Host: $(hostname) - $(date)</p>" | sudo tee /var/www/html/index.html > /dev/null
echo "[4/4] Iniciando servicio..."
sudo service nginx start || sudo service nginx reload
echo "Listo."
