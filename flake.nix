{
  description = "Dev shell for Rails (Ruby 3.1) + Postgres + Node";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = [
        # Ruby matches Gemfile (3.1.x) to avoid nio4r build breakage
        pkgs.ruby
        pkgs.bundler

        # PostgreSQL client (pg_config + headers). Use a current version.
        pkgs.postgresql_16
        pkgs.pkg-config
        pkgs.gcc
        pkgs.gnumake

        # Common native deps for gems like nokogiri/openssl/etc.
        pkgs.zlib
        pkgs.libxml2
        pkgs.libxslt
        pkgs.openssl
        pkgs.readline
        pkgs.libyaml
        pkgs.libffi

        # Frontend: current LTS
        pkgs.nodejs_22
      ];
    };
  };
}