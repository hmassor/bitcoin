# Frankfurt University of Applied Sciences - Blockchain in the Internet of Things - Team Europa
## Installation
Zunächst muss die Anwendung „Hyperledger Fabric“ installiert werden. Die Anleitung dazu findet sich unter:

https://hyperledger-fabric.readthedocs.io/en/latest/install.html

## Binär-Dateien
Nach dem Herunterladen der verpackten Datei „fra_uas_team_europa.zip“ müssen die darin enthaltenen Dateien in einen Ordner mit dem Namen „fra_uas_team_europa“ entpackt werden. Soll der Ordner einen anderen Namen bekommen, muss die const-Variable „rootfoldername“ in der Datei „/utils/AppUtil.js“ entsprechend angepasst werden. 
Nach dem Entpacken müssen die Binärdateien in den „bin“-Ordner kopiert werden. Diese Hyperledger Fabric Binärdateien sollten in Schritt 1 installiert worden sein, so dass der „bin“-Ordner nun folgende Dateien enthalten muss:

- configtxgen
- configtxlator
- cryptogen
- discover
- fabric-ca-client
- fabric-ca-server
- idemixgen
- orderer
- osnaadmin
-peer

## Vorbereitung und Bereinigung
Um Konflikte mit potentiell noch vorhandenen Dateien zu vermeiden, ist es notwendig, alte Dateien zu entfernen. In der Kommandozeile wechselt man zunächst zum Ordner „vegi-network“ und führt dort folgenden Befehl aus: 
```
cd ./vegi-network
./cleanup.sh
```
Achtung: Dieses Skript löscht alle Docker container und Docker volumes sowie alle Zertifikats-, Transaktions-, Konfigurations- und Wallet-Dateien, die sich in einem beliebigen Unterordner von „fra_uas_team_europa“ befinden.
Zur Prüfung, ob wirklich alle Docker container, Docker volumes und das net_vegi-Netzwerk gelöscht wurden, können folgende Befehle aufgerufen werden:

Falls nach Ausführung des Befehls noch Docker container, Docker volumes oder das network des net_vegi-Netzwerks erscheinen, müssen diese manuell gelöscht werden, etwa durch "prune"- oder "rm"-Befehle.
```
docker ps -a
docker volume list
docker network list
```

## Netzwerk „vegi-network“ starten
Um das Netzwerk „vegi-network“ hochzufahren, muss im gegenwärtigen Ordner „./vegi-network“ folgender Befehl eingeben werden:
Daraufhin sollte das Netzwerk „vegi-network“ mit den vier Channels „tradechannel1“, „tradechannel2“, „logisticchannel1“, „logisticchannel2“ aufgebaut werden und automatisch starten. Zudem sollten die vier Chaincodes "tradeCC1", "tradeCC2", "logisticCC1" und "logisticCC2" jeweils auf dem „tradechannel1“, „tradechannel2“, „logisticchannel1“ und „logisticchannel2“ nun selbständig zur Verfügung gestellt („deployed“) werden.
```
cd ./vegi-network
./runAll.sh
```

## Neustart des Netzwerks
Falls man das VORHANDENE, NICHT GELÖSCHTE „vegi-network“-Netzwerk nach einem Computer-Neustart wieder hochfahren möchte und zuvor auch keine Löschung der Dateien (siehe 3.Vorbereitung und Bereinigung) vorgenommen hat, kann man dies mit folgendem Befehl tun:
```
docker restart $(docker ps -a -q)
```

## Löschen des Netzwerks
Falls man das gesamte Netzwerk entfernen möchte, etwa um es von Grund auf neu aufzubauen, muss man im Ordner „./vegi-network“ einen der folgenden Befehle, gegebenenfalls mit „sudo“ vorangestellt, eingeben:
```
cd ./vegi-network
./network.sh down
./cleanup.sh
```

## Skripte einzeln ausführen
Die Skripte, die sich in „runAll.sh“ und anderen aggregierten Skripten befinden, lassen sich selbstverständlich auch einzeln ausführen. Dazu müssen allerdings die Umgebungsvariablen jeweils neu gesetzt werden, was durch folgenden Befehl bewerkstelligt werden kann:
Der zusätzliche Punkt vor dem Skript-Befehl ermöglicht es, dass die Umgebungsvariablen auch für den gegenwärtigen Prozess gesetzt werden und nicht nur für Child-Prozesse.
```
sudo . ./setEnv.sh
```

## Benutzung der Apps
Nach dem Start des „vegi-network“-Netzwerks stehen dem Benutzer die Anwendungen („Apps“) zur Verfügung, die im Ordner „apps“ zu sehen sind. Die Benutzung der Applikationen kann sowohl über die Kommandozeile als auch über eine Web-Oberfläche erfolgen.
Falls die Kommandozeile benutzt werden soll, können im Ordner „apps“ die Funktionen durch Löschen/Setzen der Kommentierung einzeln aufgerufen werden. Beispielsweise können die Funktionen createVegi, createGrower und createOwner in einer Integrated Development Environment durch Wegnahme der „Forward Slashes“ und „run“ ausgeführt werden.

Einige Hilfsparameter für die Funktionen haben wir in der dortigen Datei oben aufgeführt. Selbstverständlich können diese durch eigene Parameter ersetzt werden.
