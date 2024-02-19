#!/usr/bin/env bash

checker() {
    if ! command -v $1 &> /dev/null; then
        echo -e "\033[91m[❌] Installed $1\033[95m"
    else
        version=$($1 $2)
        echo -e "\033[92m[✅] Installed $1 ($version)\033[0m"
    fi
}

checker "code" "-v"
checker "git" "--version"
checker "node" "-v"
checker "java" "--version"
checker "besu" "--version"
checker "teku" "--version"
